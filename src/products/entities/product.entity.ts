import { text } from "stream/consumers";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CreateProductDto } from "../dto/create-product.dto";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true,
    })
    title: string;

    @Column('float', {
        default: 0,
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'text',
        unique: true,
    })
    slug: string;

    @Column({
        type: 'int',
        default: 0,
    })
    stock: number;

    @Column({
        type: 'text',
        array: true,
    })
    size: string[];

    @Column({
        type: 'text',
    })
    gender: string;

    //tag
    //images

    @BeforeInsert()
    checkSlugInsert(){
        if( !this.slug ){
            this.slug = this.title;
        }
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '')
        .replaceAll("'", '');
    }
}
