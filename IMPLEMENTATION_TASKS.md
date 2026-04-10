# TVR Edit Feature Enhancements - Implementation Tasks

Based on the requirements to update the TVR edit functionalities, here is the detailed technical breakdown and steps required for an AI agent to execute the changes efficiently in the codebase.

## Task 1: SpreadsheetGrid Adjustments (Cell Highlighting)

**Target File**: `src/components/spreadsheet/SpreadsheetGrid.tsx`

1.  **Add `cellErrors` property to `SpreadsheetGridProps` interface.**
    - Introduce `cellErrors?: Array<Record<string, string | boolean>>` to accept error states mapping `rowIndex -> columnId`.
2.  **Destructure `cellErrors` in the component arguments.**
3.  **Detect and highlight invalid cells.**
    - In the cell rendering loop (`columns.map(...)`), extract the error for the current cell using `const cellError = cellErrors?.[rowIndex]?.[col.id]`.
    - Update the `className` logic for the HTML `<td>` element. Add conditional CSS highlighting when an error exists: `cellError && !focused && 'ring-2 ring-red-500 ring-inset bg-red-50'`.

## Task 2: Page Logic Adjustments (Deferred Validation & State)

**Target File**: `src/app/(auth)/tvrs/[id]/page.tsx`

1.  **Introduce an error mapping state.**
    - Initialize `const [cellErrors, setCellErrors] = useState<Record<string, Record<string, string>>>({})` mapping row `id` to its column errors.
2.  **Clear errors on input change.**
    - Inside the `handleCellChange` callback, add a state update to remove the specific `[columnId]` from `cellErrors[row.id]` when the user modifies that cell.
3.  **Pass `cellErrors` to the SpreadsheetGrid component.**
    - Since the grid renders `filteredRows`, compute the active errors during render: `cellErrors={filteredRows.map((row) => cellErrors[row.id] || {})}`.
4.  **Remove Frontend Blocking Validator.**
    - Inside the `handlePrepared` submission logic (specifically for `DSTAX_PREPARER`), safely remove the loop that iterates through `requiredFieldsForPreparer` and constructs `incompleteRows`.
    - Remove the frontend barrier that throws `toast.error` to halt function execution, allowing incomplete payloads to reach the backend mapping.

## Task 3: API Error Handling & Short Messages

**Target File**: `src/app/(auth)/tvrs/[id]/page.tsx`

1.  **Capture specific row rejections.**
    - Inside the `Promise.allSettled` evaluation, iterate through `results.forEach((res, idx) => ... )`. If rejected, fetch the associated `changedIdsArray[idx]` to link the error to the correct row.
2.  **Parse detailed responses into short UI messages.**
    - Target `res.reason?.response?.data`. If the error type is `validation_error` and `errors` is an array, iterate over each nested error object.
    - Translate cumbersome API descriptors into localized identifiers using:
      ```typescript
      let shortMsg = 'Invalid type'
      if (
        err.code === 'required' ||
        err.code === 'null' ||
        err.code === 'blank' ||
        err.detail?.toLowerCase().includes('required') ||
        err.detail?.toLowerCase().includes('null')
      ) {
        shortMsg = 'Missing input'
      }
      ```
    - Map these messages back to `newCellErrors[rowId][colId] = shortMsg`.
3.  **Deploy isolated, red-themed Sonner toasts.**
    - Render the short error directly via `toast.error(msg, { style: { background: '#ef4444', color: 'white', border: 'none' } })`.
    - Update the overarching `catch` block wrapping `handlePrepared` to enforce the inline red styling equally.
