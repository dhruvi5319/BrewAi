export function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    console.error(err.stack);
    res.status(500).json({
        data: null,
        error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
        status: 500,
    });
}
