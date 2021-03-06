import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Follow } from "./follow";
import { Member } from "./member";
import { Room } from "./room";
import { SocialID } from "./social";

@ObjectType()
export abstract class PartialUser extends BaseEntity {

    /**
     * Username
     * This is changable by the end user and should not be used as an identifier.
     */
    @Field()
    @Column({ type: 'varchar', length: 12 })
    username: string = 'Anonymous';

    /**
     * User Avatar URL
     * This is changable by the end user and should not be used as an identifier.
     */
    @Field()
    @Column({ type: 'varchar', length: 200 })
    avatar: string;

    /**
     * Biography
     * This is changable by the end user and should not be used as an identifier.
     */
    @Field()
    @Column({ type: 'varchar', length: 200 })
    bio: string = 'Hello Dogehouse';
}

@ObjectType()
@Entity()
export class User extends PartialUser {

    /**
     * Identifier
     * This is the unique user identifier
     */
    @Field(type => Int)
    @PrimaryGeneratedColumn('increment')
    id: number;

    /**
     * Socials
     * This is a list of platforms that the user is connected with
     */
    @OneToMany(type => SocialID, socialID => socialID.user)
    socials: SocialID[];

    /**
     * Current Room
     * Random
     */
    @Field(type => Member, { nullable: true })
    current_room: Member;

    @Field(type => Int)
    follower_count: number;

    @Field(type => Int)
    following_count: number;
    
    @Field(type => Boolean)
    am_following: boolean;

    @Field(type => [Follow])
    @OneToMany(type => Follow, user => user.follower)
    following: Follow[];

    @Field(type => [Follow])
    @OneToMany(type => Follow, user => user.following)
    followers: Follow[];
    
    @Column({
        type: "timestamp",
        default: () => "NOW()"
    })
    created_on: Date;

    @Column({
        type: "timestamp",
        default: () => "NOW()"
    })
    modified_on: Date;

    @BeforeInsert()
    updateDateCreation() {
        this.modified_on = new Date();
    }
};