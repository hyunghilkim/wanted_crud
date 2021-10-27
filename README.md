# 게시판 CRUD 과제

## 실행방법

```
npm install

npm start
```

<br/>

## API 명세

```

(인증)
POST auth/signup 회원가입 public
POST auth/login 로그인 public
GET auth/logout 로그아웃

(게시글)
GET /posts 글목록 public
POST /posts/write 글 작성 user
GET /posts/detail/:id 글 확인 public
GET /posts/delete/:id 글 삭제 user
GET /posts/edit/:id 글 수정 user

```

<br/>

## 구현한 방법

```
게시글판 CRUD
생성, 읽기, 수정, 삭제 기본에 충실하였고,
고민되었던 부분은 인증 방식에 대한 여러 방법이 있었지만,
jwt토큰 인증 방식을 택하여, 세션을 통한 방식과 달리 서버측 부하를 낮출수 있어 선택하였습니다.

```

<br/>
