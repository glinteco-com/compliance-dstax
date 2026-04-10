# TVR Edit Tasks

These tasks describe required enhancements for the TVR edit page.

- [ ] **Cell Highlighting & Error Toasts**:
  - Update the TVR edit page to highlight missing or incorrect input cells with a red border.
  - Ensure toast notifications for errors are shown in red.
- [ ] **Allow Deferred Validation**:
  - Allow the "PREPARED" action (pushing the request body) even if types are incorrect or required fields are missing.
  - Let the backend handle the final validation instead of blocking on the frontend.
- [ ] **Short Error Messages**:
  - Display simplified error messages (e.g., "Missing input" or "Invalid type") instead of detailed response messages from the backend.
