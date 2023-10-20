import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { CommonEntity } from '../common/entities/common.entity' // ormconfig.json에서 파싱 가능하도록 상대 경로로 지정
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import { Exclude } from 'class-transformer'
import { BlogEntity } from '../blogs/blogs.entity'
import { ProfileEntity } from '../profiles/profiles.entity'

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'USER',
}) // USER : 테이블 명
export class UserEntity extends CommonEntity {
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string

  @IsString()
  @IsNotEmpty({ message: '이름을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  username: string

  @Exclude() // Exclude 데코레이터를 사용하면 해당 컬럼은 반환되지 않는다. - 단 클래스 직렬화를 해줘야 함
  @Column({ type: 'varchar', nullable: false })
  password: string

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean

  //* Relation */

  @OneToOne(() => ProfileEntity) // 단방향 연결, 양방향도 가능 꼭 필요한 경우가 아니면 단방향으로 하는 것이 좋다.
  @JoinColumn({ name: 'profile_id', referencedColumnName: 'id' })
  profile: ProfileEntity

  @OneToMany(
    () => BlogEntity,
    (blog: BlogEntity) => blog.author, // 콜백함수 인자로 블로그 엔티티 author에 user를 보낼수 있다
    {
      cascade: true, // 사용자를 통해 블로그가 추가, 수정, 삭제되고 사용자가 저장되면 추가된 블로그도 저장된다.
    },
  ) // 가상 컬럼: 실제 DB에 연결되는 컬럼이 아니고, 엔티티 간의 관계를 정의하는 컬럼
  blogs: BlogEntity[]
}

/*
const author = await User.findOne( { id: '...' } )
author.blogs.push(new BlogEntity(...))
await author.save()
*/
