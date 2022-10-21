const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;

const payload = {
  foo: "bar",
};
const privateKey = "secret_key";

/* 토큰 발행 */
app.get("/", (req, res) => {
  const token = jwt.sign(payload, privateKey);
  res.send(token);
});

/* 토큰 발행(+유효기간)*/
app.get("/expire/:second", (req, res) => {
  const { second } = req.params;
  const newPayload = Object.assign({}, payload, {
    exp: Math.floor(Date.now() / 1000) + second * 1,
  });
  const token = jwt.sign({ payload: newPayload }, privateKey);
  res.send(token);
});

/* 
    - 토큰 디코딩 리턴 
    - 리턴값
    {
        payload: {
            foo: "bar",
            exp: 1641448639
        },
        iat: 1641448609 // 발급 시간, 자동으로 생성됨
    }
    - 토큰 포맷
    [header].[payload],[signature]

    signature 의 경우 header, payload, secret key 를 header에 명시된 알고리즘으로 해싱 + base64 인코딩하여 생성됨
    hs256의 해싱 데이터는 복호화 불가, jwt가 토큰을 검증하는 경우 header나 payload의 정보가 조금이라도 다르면 유효하지 않음
*/

app.get("/decode/:token", (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, privateKey);
    const tokenParts = token.split(".");
    const decoded1 = Buffer.from(tokenParts[0], "base64");
    const decoded2 = Buffer.from(tokenParts[1], "base64");
    const signature = crypto
      .createHmac("sha256", privateKey)
      .update(tokenParts[0] + "." + tokenParts[1]) // 여기까지 만들어진 해쉬를
      .digest("base64") // base64의 형태로 인코딩(hex -> base64)
      .replaceAll("=", "")
      .replaceAll("+", "-")
      .replaceAll("/", "_"); // base64 -> base64Url

    console.log(`token header   : ${decoded1.toString()}`);
    console.log(`token payload  : ${decoded2.toString()}`);
    console.log(`token signature    : ${tokenParts[2]}`);
    console.log(`created signature  : ${signature}`);

    if (signature === tokenParts[2]) {
      console.log("signature 생성 성공");
    }

    res.send(decoded);
  } catch (e) {
    res.send("invalid token");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
