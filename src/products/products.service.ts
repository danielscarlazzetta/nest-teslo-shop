import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product,ProductImage } from './entities';
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
  ) {
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...prodtDetails } = createProductDto;

      const product = this._productRepository.create({
        ...prodtDetails,
        images: images.map(image => this._productImagesRepository.create({url: image})),
      });

      await this._productRepository.save(product);
      return {...product, images};
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

    return product.map( product => ({
      ...product,
      images: product.images.map( img => img.url)
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

    const product = await this._productRepository.preload({
      id: id,
      ...updateProductDto,
      images: []
    });
    if (!product) throw new NotFoundException(`El producto con el id ${id} no se encuentra`);

    try {

      await this._productRepository.save(product);
      return product;

    } catch (error) {
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

  async findOnePlain( term: string){
    const { images= [], ...rest} = await this.findOne( term );

    return {
      ...rest,
      images: images.map( image => image.url)
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