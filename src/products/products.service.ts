import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product, ProductImage } from './entities';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly _productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly _productImagesRepository: Repository<ProductImage>,

    private readonly _dataSource: DataSource,
  ) {
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...prodtDetails } = createProductDto;

      const product = this._productRepository.create({
        ...prodtDetails,
        images: images.map(image => this._productImagesRepository.create({ url: image })),
      });

      await this._productRepository.save(product);
      return { ...product, images };
    } catch (err) {
      this.handleDBException(err);
    }
  }

  //Paginar
  async findAll(paginationDTO: PaginationDTO) {

    const { limit = 10, offset = 0 } = paginationDTO;

    const product = await this._productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });

    return product.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }));
  }

  async findOne(term: string) {

    let product: Product;
    if (isUUID(term)) {
      product = await this._productRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this._productRepository.createQueryBuilder('prod');
      //const queryBuilder = this._productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug or tags =:tags`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
          tags: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`Producto con id ${term} no encontrado`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this._productRepository.preload({
      id: id,
      ...toUpdate,
    });

    if (!product) throw new NotFoundException(`El producto con el id ${id} no se encuentra`);

    //Create Query Runner
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(image => this._productImagesRepository.create({ url: image }))
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release(); 
      //return product;
      return this.findOnePlain(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBException(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this._productRepository.remove(product);
  }

  private handleDBException(err: any) {
    if (err.code === '23505') {
      throw new BadRequestException(err.detail);
    }
    this.logger.error(err);
    throw new InternalServerErrorException('Check server logs')
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);

    return {
      ...rest,
      images: images.map(image => image.url)
    }

  }

  async deleteAllProduct() {
    const query = this._productImagesRepository.createQueryBuilder('product');

    try{
      return await query
      .delete()
      .where({})
      .execute();
    }catch(err){
      this.handleDBException(err);
    }
  }
  
}


/*
{
    "title": "Polera",
    "price":
    "description":
    "slug": "Polera_Seleccion"
    "stock":
    "size": ["SM","M","L"],
    "gender": "men"
}
*/