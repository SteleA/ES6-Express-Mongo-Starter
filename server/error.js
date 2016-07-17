'use strict';

export default function(app) {
    // development error handler will print stacktrace
    if (process.env.NODE_ENV !== 'production') {
        app.use((err, req, res) => {
            return res.status(err.status || 500).json({
                error: err
            });
        });
    } else {
        app.use((err, req, res) => {
            res.status(err.status || 500).json({
                message: err.message,
                error: {}
            });
        });
    }
}
