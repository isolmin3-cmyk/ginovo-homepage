# GINOVO 관리자 로그인 연결

관리자 주소는 별도 DNS가 필요하지 않은 기존 기업 도메인의 아래 주소를 사용합니다.

- 운영 주소: `https://www.greentalk.co.kr/admin.html`
- Supabase Site URL: `https://www.greentalk.co.kr`
- Redirect URL: `https://www.greentalk.co.kr/admin.html?recovery=1`

## 1. Supabase 프로젝트 준비

1. 회사 소유 계정으로 Supabase 프로젝트를 만듭니다.
2. Authentication에서 이메일 로그인을 사용하고 공개 회원가입은 끕니다.
3. SQL Editor에서 `supabase/migrations/202609210001_admin_auth.sql`을 실행합니다.
4. Authentication → Users에서 운영 담당자 이메일 계정을 생성하거나 초대합니다.
5. 생성된 사용자 UUID를 복사한 뒤 SQL Editor에서 다음처럼 권한을 등록합니다.

```sql
insert into public.admin_users (user_id, role, active, display_name)
values ('사용자-UUID', 'publisher', true, '운영 담당자');
```

## 2. 홈페이지 설정값 연결

Supabase Dashboard의 Project URL과 **publishable key**를
`assets/supabase-config.js`에 입력합니다.

`sb_secret_...` 또는 기존 `service_role` 키는 브라우저 코드와 GitHub 저장소에
절대로 넣지 않습니다.

## 3. Auth URL 설정

Authentication → URL Configuration에서 다음 값을 등록합니다.

- Site URL: `https://www.greentalk.co.kr`
- Redirect URLs: `https://www.greentalk.co.kr/admin.html?recovery=1`
- 개발 검수 시 필요하면 `http://localhost:4173/admin.html?recovery=1`도 추가

## 4. 운영 확인

1. 관리자 주소를 열면 이메일·비밀번호 로그인 화면만 표시되어야 합니다.
2. `admin_users`에 없는 Auth 계정은 로그인 후에도 접근이 거부되어야 합니다.
3. 비밀번호 재설정 이메일 링크가 관리자 주소로 돌아와야 합니다.
4. 로그아웃 후 편집 모드 주소에 직접 접근하면 다시 로그인 화면으로 이동해야 합니다.

현재 편집 결과는 아직 브라우저 로컬 저장소에만 보관됩니다. 로그인과 권한 기반을 먼저
운영 수준으로 교체한 것이며, 여러 기기에서 같은 내용을 즉시 게시하려면 다음 단계에서
콘텐츠 테이블·Storage·공개 읽기 경로를 연결해야 합니다.
