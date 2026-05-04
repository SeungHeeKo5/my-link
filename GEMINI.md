# 프로젝트 개요
이 프로젝트는 `create-next-app`을 사용하여 생성된 **Next.js** 기반의 웹 애플리케이션입니다. `my-profile` 디렉토리에 핵심 소스 코드가 위치해 있으며, 개인 프로필이나 랜딩 페이지 구축을 목적으로 하고 있습니다.

## 주요 기술 스택
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Linter:** ESLint

## 디렉토리 구조
- `my-profile/`: Next.js 프로젝트의 루트 디렉토리
  - `app/`: Next.js App Router 기반의 페이지 및 레이아웃 정의
  - `public/`: 정적 파일 (이미지, 아이콘 등) 저장
  - `package.json`: 프로젝트 의존성 및 스크립트 설정
  - `tsconfig.json`: TypeScript 설정

## 실행 및 빌드 방법
모든 명령어는 `my-profile` 디렉토리 내에서 실행해야 합니다.

- **개발 서버 실행:**
  ```bash
  npm run dev
  ```
- **프로젝트 빌드:**
  ```bash
  npm run build
  ```
- **프로덕션 서버 시작:**
  ```bash
  npm run start
  ```
- **린트 체크:**
  ```bash
  npm run lint
  ```

## 개발 컨벤션
- **App Router:** `app/` 디렉토리 구조를 따르며, 파일 기반 라우팅을 사용합니다.
- **Styling:** Tailwind CSS를 사용하여 스타일을 적용합니다.
- **TypeScript:** 엄격한 타입 체크를 지향하며, 인터페이스와 타입을 적극적으로 활용합니다.
- **Components:** 가능한 경우 서버 컴포넌트를 우선적으로 사용하고, 인터랙션이 필요한 경우에만 클라이언트 컴포넌트(`'use client'`)를 사용합니다.
