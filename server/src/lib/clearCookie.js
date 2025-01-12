const clearCookie = (res, cookieName) => {
    res.clearCookie(cookieName, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
}

export default clearCookie