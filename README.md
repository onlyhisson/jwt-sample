## 서버 프로그램 시작

node server.js

## 아래와 같이 요청

### 토큰생성

http://localhost:3000/

### 토큰 만료시간 현재 시간보다 30초 이후로 설정

http://localhost:3000/expire/30

### 토큰 디코딩 및 로그로 signature 생성 원리 디버깅

http://localhost:3000/decode/[token]
