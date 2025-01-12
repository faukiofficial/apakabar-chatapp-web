const createActivateToken = (user) => {
    const activateCode = Math.floor(100000 + Math.random() * 900000);
    const activateToken = jwt.sign({ userId: user._id, activateCode }, process.env.ACTIVATION_TOKEN, {
        expiresIn: "30m"
    });
    return { activateCode, activateToken };
}