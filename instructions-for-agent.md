# AI Agent Prompts & Instructions: Refactor Clients Module

**Main Goal:** Refactor the Clients module and its children pages to improve navigation, access control, and data representation based on user roles.

## Prerequisite Analysis & General Rules

- The application uses `better-auth` for authentication.
- There are four main roles referenced: `Client Admin`, `Client Staff`, `Dstax Admin`, and `Dstax Preparer`.
- Sidebar navigation and page access must strictly enforce these roles.
- Ensure all new UI components follow the existing shadcn/ui and Tailwind CSS design patterns.

---

### Phase 1: Authentication Utilities

**Task 1: Create Role/Auth Utility Function**

- **Analysis:** Before building role-protected pages, the agent needs a centralized, reliable way to check the current user's role on both the server and client sides to avoid redundant code.
- **Agent Instructions:**
  1. Create a utility file for role checking (e.g., `src/lib/auth/role-utils.ts`).
  2. Implement helper functions/hooks using the existing session data from `better-auth`.
  3. Export methods that return booleans for RBAC, such as: `isClientAdmin(user)`, `isClientStaff(user)`, `isDstaxAdmin(user)`, and `isDstaxPreparer(user)`.

---

### Phase 2: Client Views Restructuring

**Task 2: Implement "Client" Page (For Client Roles)**

- **Analysis:** Users belonging to a client organization (Admin and Staff) need a root-level dashboard displaying their specific client details. The "User list" component requires specific restrictions within this page.
- **Agent Instructions:**
  1. Create a new route at `src/app/client/page.tsx` (singular).
  2. Add "Client" to the root sidebar navigation.
  3. Restrict UI visibility of this sidebar item and route access to `Client Admin` and `Client Staff` roles only.
  4. Build the page to fetch and display:
     - Client Information
     - Legal Entities List
     - List TVR (Tax Valuation Report) Period
  5. Conditionally render the **User list** section: ensure it is _only_ visible if the user's role is `Client Admin`.

**Task 3: Implement "Clients" Page (For Dstax Roles)**

- **Analysis:** Internal staff (Dstax Admin and Preparer) manage multiple clients and thus require a root-level list view of all clients they have access to.
- **Agent Instructions:**
  1. Create a new route at `src/app/clients/page.tsx` (plural).
  2. Add "Clients" to the root sidebar navigation, restricted to `Dstax Admin` and `Dstax Preparer`.
  3. Display a paginated list or table of clients managed by the current user.
  4. Make each row/card in the list clickable, linking to a detailed view of that client (e.g., dynamic route `src/app/clients/[clientId]/page.tsx`). _Hint: Reuse UI components from Task 2 for the detail view._

---

### Phase 3: Global Navigation Refactoring

**Task 4: Refactor "Users" Page**

- **Analysis:** The Users management page needs to be elevated to the root sidebar and heavily restricted.
- **Agent Instructions:**
  1. Locate the existing `Users` page and its navigation configuration.
  2. Relocate the navigation link to the root level of the sidebar.
  3. Apply the authorization utility from Task 1 to restrict this page and its sidebar link strictly to the `Dstax Admin` role.

**Task 5: Refactor "Legal Entities" Page**

- **Analysis:** Move to the root sidebar, restrict to Dstax roles, and enhance usability with search and filter capabilities.
- **Agent Instructions:**
  1. Locate the existing `Legal Entities` list page (e.g., `src/app/legal-entities/page.tsx`).
  2. Move its navigation link to the root level of the sidebar.
  3. Restrict route access and sidebar visibility to `Dstax Admin` and `Dstax Preparer`.
  4. Implement an input field to **Search** by entity name.
  5. Implement dropdown components to **Filter** the entities (e.g., by status or associated client).

---

### Phase 4: Detail Views

**Task 6: Create "Legal Entity Detail" Page**

- **Analysis:** A new detail view corresponding to the Legal Entities list so Dstax workers can view specific entity configurations.
- **Agent Instructions:**
  1. Create a dynamic route for the detail page, e.g., `src/app/legal-entities/[id]/page.tsx`.
  2. Fetch and display the **Basic Info** of the selected legal entity.
  3. Create two distinct sections/tables:
     - List of **Client Staff** associated with this entity.
     - List of **Dstax Preparers** associated with this entity.
  4. Add a prominent, functional Link or button component that navigates the user to view the **Current TVR** associated with this legal entity.
