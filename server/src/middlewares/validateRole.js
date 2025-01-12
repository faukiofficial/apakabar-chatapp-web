const validateRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this resource",
        });
    }
    next();
}

export default validateRole;