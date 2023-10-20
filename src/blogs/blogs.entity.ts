import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { CommonEntity } from '../common/entities/common.entity' // ormconfig.json에서 파싱 가능하도록 상대 경로로 지정
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { ProfileEntity } from '../profiles/profiles.entity'
import { UserEntity } from 'src/users/users.entity'
import { TagEntity } from 'src/tags/tags.entity'
import { VisitorEntity } from 'src/visitors/visitors.entity'

/*
? CommonEntity: 여러 테이블에 걸쳐 공통으로 사용되는 컬럼들을 모아놓은 추상 클래스

  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    type: 'timestamptz'
  })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
  
  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date | null
*/
/*
 * @Column: 컬럼을 정의하는 데코레이터 => db에 저장될때의 형식을 지정해준다.
 * @Is... : class-validator의 데코레이터 => 해당 컬럼의 유효성 검사를 해준다.
 */
@Entity({
  name: 'BLOG', // 실제 테이블 명 - 따로 지정하지 않으면 클래스명을 따라간다.
})
export class BlogEntity extends CommonEntity {
  /*
   *  @Column의 type:
   *    - varchar: 일반적인 문자열을 생각하면 됨, 여유가 된다면 꼭 길이를 지정해주자.
   *    - text: 굉장히 긴 문자열(게시글이나 메모글 같은), 여유가 된다면 꼭 길이를 지정해주자.
   */
  @Column({ type: 'varchar', unique: true, nullable: false })
  title: string

  @Column({ type: 'varchar', nullable: true })
  description: string

  @Column({ type: 'text', nullable: true })
  content: string

  //* 관계 테이블 */
  @ManyToOne(
    () => UserEntity,
    (author: UserEntity) => {
      onDelete: 'CASCADE' // 사용자가 삭제되면 블로그도 삭제된다.
    },
  )
  @JoinColumn([
    // foreignkey 정보들
    {
      name: 'author_id' /* db에 저장되는 필드 이름 */,
      referencedColumnName: 'id' /* USER의 id */,
    },
  ])
  author: UserEntity

  @ManyToMany(() => TagEntity, (tag: TagEntity) => tag.blogs, {
    cascade: true, // 블로그를 통해 태그가 추가, 수정, 삭제되고 블로그를 저장하면 태그도 저장된다.
  })
  @JoinTable({
    //JoinTable: 테이블을 만들어준다! - 중간테이블
    name: 'BLOG_TAG',
    joinColumn: {
      name: 'blog_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[]

  @OneToMany(() => VisitorEntity, (visitor: VisitorEntity) => visitor.blog, {
    cascade: true, // 블로그를 통해 방문자가 추가, 수정, 삭제되고 블로그를 저장하면 방문자도 저장된다.
  })
  visitors: VisitorEntity[]
}

/*
? 사용법
const author = await User.findOne( { id: '...' } )
author.blogs.push(new BlogEntity(...))
await author.save()
*/

// import { CommonEntity } from '../common/entities/common.entity' // ormconfig.json에서 파싱 가능하도록 상대 경로로 지정
// import { UserEntity } from '../users/users.entity'
// import { TagEntity } from '../tags/tags.entity'
// import { VisitorEntity } from '../visitors/visitors.entity'
// import {
//   Column,
//   Entity,
//   JoinColumn,
//   JoinTable,
//   ManyToMany,
//   ManyToOne,
//   OneToMany,
// } from 'typeorm'

// @Entity({
//   name: 'BLOG',
// })
// export class BlogEntity extends CommonEntity {
//   @Column({ type: 'varchar', nullable: false })
//   title: string

//   @Column({ type: 'varchar', nullable: true })
//   description: string

//   @Column({ type: 'text', nullable: true })
//   contents: string

//   //* Relation */

//   @ManyToOne(() => UserEntity, (author: UserEntity) => author.blogs, {
//     onDelete: 'CASCADE', // 사용자가 삭제되면 블로그도 삭제된다.
//   })
//   @JoinColumn([
//     // foreignkey 정보들
//     {
//       name: 'author_id' /* db에 저장되는 필드 이름 */,
//       referencedColumnName: 'id' /* USER의 id */,
//     },
//   ])
//   author: UserEntity

//   @ManyToMany(() => TagEntity, (tag: TagEntity) => tag.blogs, {
//     cascade: true, // 블로그를 통해 태그가 추가, 수정, 삭제되고 블로그를 저장하면 태그도 저장된다.
//   })
//   @JoinTable({
//     // table
//     name: 'BLOG_TAG',
//     joinColumn: {
//       name: 'blog_id',
//       referencedColumnName: 'id',
//     },
//     inverseJoinColumn: {
//       name: 'tag_id',
//       referencedColumnName: 'id',
//     },
//   })
//   tags: TagEntity[]

//   @OneToMany(() => VisitorEntity, (visitor: VisitorEntity) => visitor.blog, {
//     cascade: true,
//   })
//   visitors: VisitorEntity[]
// }
