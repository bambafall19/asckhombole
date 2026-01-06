// A custom error class for Firestore permission errors.
// This is used to display more helpful error messages to the developer
// in the Next.js development overlay.

export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete';
    requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
    constructor(public context: SecurityRuleContext) {
        const { path, operation, requestResourceData } = context;

        const requestDataString = requestResourceData
            ? `\n  "request.resource.data": ${JSON.stringify(requestResourceData, null, 2).replace(/"/g, "'")}`
            : '';
        
        const message = `
Firestore Security Rules have denied a '${operation}' request on path '${path}'.

To fix this, edit your firestore.rules file and grant access to this path.
Make sure to also update the corresponding schema in backend.json.

Security Rule Context:
{
  "path": "${path}",
  "method": "${operation}"${requestDataString}
}
`;

        super(message);
        this.name = 'FirestorePermissionError';

        // This is to make the error message more readable in the Next.js overlay
        this.stack = '';
    }
}
