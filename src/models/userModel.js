class User {
    constructor(email, password, role, name, lastname) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
        this.lastname = lastname;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

module.exports = User;
