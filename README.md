# Running the app
Requirements: npm, nvm

### Frontend only
1. In `client/src/main.ts`, change the flag on line 10 to `false`
2. `nvm use`
3. `cd client`
4. `npm install`
5. `npm run dev`
6. Navigate to localhost:5173

### Frontend + Backend
Make sure line 10 in `client/src/main.ts` is set to `true`

#### Backend
1. `nvm use`
2. `cd client`
3. `npm install`
4. `npm start`

#### Frontend
1. `nvm use`
2. `cd client`
3. `npm install`
4. `npm run dev`
5. Navigate to localhost:5173

### Frontend Tests
1. `nvm use`
2. `cd client`
3. `npm install`
4. `npm run test`


# Known remaining bugs
- Expanding a folder before selecting it shows nothing in the sidebar because the API state is not yet connected to the expand functionality.
- Non alpha-numeric characters in a directory's name can cause the backend to throw an error when looking up the directory.
- The table rows are not accessible, they can be hovered over using tab navigation, but cannot be clicked on without the use of a mouse.
- Several other smaller a11y issues (labels, tree navigation isn't WCAG compliant)


# Future steps
- Error handling
- File contents viewing
- Adjustable and sortable table columns
- WCAG compliance
- Add more unit tests