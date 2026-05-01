# Project Rules: Smile SaaS PRO 2

This document defines the mandatory rules and standards for the Smile SaaS PRO 2 project. These rules supplement the global system instructions.

## 1. Technical Stack & Architecture
- **Backend**: NestJS (Node.js) with TypeScript.
- **Frontend**: React with Vite, Tailwind CSS, and Zustand for state management.
- **ORM**: Prisma with PostgreSQL.
- **Infrastructure**: AWS (S3, CloudFront), Terraform for IAC.
- **Workspace**: npm workspaces (root, `/backend`, `/frontend`).

## 2. Naming Conventions (Language: Spanish)
- **Code Language**: All code identifiers (Classes, Methods, Variables, Files, and Folders) MUST be in Spanish.
  - *Exception*: Standard technical terms or library names (e.g., `id`, `JWT`, `NestJS`, `React`) may remain in English if no natural Spanish equivalent exists or if it's a standard interface.
### Backend
- **Files**: Use NestJS standard naming: `name.controller.ts`, `name.service.ts`, `name.module.ts`, `name.dto.ts`.
- **Classes**: `NameController`, `NameService`, `CreateNameDto`.
- **Database**: Prisma models should be PascalCase, table names (map) should be snake_case.

### Frontend
- **Components**: PascalCase (e.g., `ButtonSubmit.tsx`).
- **Hooks**: camelCase starting with `use` (e.g., `useSeguimientos.ts`).
- **Styling**: Use Tailwind CSS utility classes. Avoid custom CSS files unless strictly necessary for complex animations.
- **State**: Centralize global state in Zustand stores under `frontend/src/store`.

## 3. Multitenancy & Security
- **Mandatory Scoping**: Every database query in the backend MUST include a filter for `tenant_id` to ensure data isolation.
- **Tenant Context**: Use the `TenantContext` or equivalent middleware to extract the tenant ID from the request (JWT).
- **Frontend**: All API calls must include the Bearer token for authentication.

## 4. Development Workflow
- **No Browser Validation**: Do NOT use the browser subagent (`browser_subagent`) for standard code or UI validations unless explicitly requested by the user.
- **Suggestion-First Approach**: For every request, always suggest a plan or the next steps ("qué hacer") before or alongside the execution.
- **Dead Code Prevention**: Before implementing a new feature, check `DEAD_CODE_REPORT.md`. If a partially implemented version exists, refactor and complete it instead of starting from scratch.
- **Type Safety**: Ensure backend DTOs and frontend interfaces are synchronized. Shared types should be used where possible or strictly mapped.
- **Testing**:
  - Backend: Use Jest for unit and integration tests.
  - Frontend: Focus on component testing and hook validation.

## 5. Environment & Commands (Windows 11)
- **Shell**: Always use **PowerShell**.
- **Commands**:
  - Use `dir` or `Get-ChildItem` instead of `ls`.
  - Use `del` or `Remove-Item` instead of `rm`.
  - Use `type` instead of `cat`.
  - Use backslashes (`\`) for all file paths.
- **Tools**: Use `jcodemunch` for semantic code analysis and indexing (`uidx` command).

## 6. Project Context: Smile SaaS
- **Domain**: Odontology/Dental Clinic management.
- **Focus**: "Efecto WOW" (Smile design), Commercial tracking (Essential/Premium/Pro options), and CRM/Timeline for patient follow-up.
- **Status**: Currently integrating the Budgeting and Follow-up modules.
