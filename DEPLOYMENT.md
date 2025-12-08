# Review Service - Vercel 배포 가이드

## 📋 개요

Review Service를 Vercel에 배포하고 Swagger UI를 통해 API를 테스트할 수 있도록 설정하는 가이드입니다.

## 🚀 Vercel 배포 단계

### 1. Vercel 계정 및 CLI 설치

```bash
npm install -g vercel
vercel login
```

### 2. 프로젝트 배포

```bash
vercel
```

### 3. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```env
NODE_ENV=production
DB_HOST=aws-1-ap-northeast-2.pooler.supabase.com
DB_PORT=6543
DB_USERNAME=postgres.ifrdgfvwcidqqzmpgzqw
DB_PASSWORD=Eqipl7Bsgwvn5Aq0
DB_DATABASE=postgres
PERFORMANCE_SERVICE_URL=https://performance-service.vercel.app
JWT_SECRET_KEY=your_secret_key_here
```

## 🌐 배포 후 Swagger UI 접근

배포가 완료되면 다음 URL에서 Swagger UI에 접근할 수 있습니다:

```
https://your-project-name.vercel.app/api
```

### 예시

```
https://review-service.vercel.app/api
```

## 📝 주요 설정 파일

### vercel.json

- 빌드 명령어 및 런타임 설정
- 환경 변수 관리
- 라우팅 설정

### src/main.ts

- CORS 활성화 (Vercel 크로스 오리진 요청 지원)
- Swagger 서버 설정 (자동으로 Vercel URL 감지)
- 개발 및 프로덕션 환경 분리

## 🔒 보안 주의사항

1. **환경 변수 보안**: 민감한 정보는 `.env` 파일에 저장하지 말고 Vercel 대시보드에서 설정하세요.
2. **JWT 시크릿**: 강력한 시크릿 키를 생성하여 사용하세요.
3. **CORS 설정**: 프로덕션에서는 필요한 오리진만 허용하세요.

## 🧪 로컬 테스트

배포 전에 로컬에서 테스트하세요:

```bash
# 개발 환경
npm run start:dev

# Swagger UI 접근
http://localhost:3000/api
```

## ✅ 배포 체크리스트

- [ ] Vercel 계정 생성
- [ ] 프로젝트를 Vercel에 연결
- [ ] 환경 변수 설정
- [ ] 빌드 성공 확인
- [ ] Swagger UI 접근 테스트
- [ ] API 엔드포인트 테스트

## 🐛 트러블슈팅

### Swagger UI가 보이지 않는 경우

1. `VERCEL_URL` 환경 변수 확인
2. `src/main.ts`의 `addServer()` 설정 확인
3. Vercel 빌드 로그 확인

### CORS 오류

1. `app.enableCors()` 설정 확인
2. 요청 오리진이 허용되어 있는지 확인

### 데이터베이스 연결 실패

1. Supabase 환경 변수 확인
2. 방화벽 설정 확인 (Vercel IP 허용 필요)

## 📚 참고 자료

- [Vercel NestJS 배포 가이드](https://vercel.com/guides/nestjs-deployment)
- [Swagger/OpenAPI 문서](https://docs.nestjs.com/recipes/swagger)
- [NestJS 배포 가이드](https://docs.nestjs.com/deployment)
