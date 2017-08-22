//User Model
module.exports = function(sequelize, DataTypes) {
    var users = sequelize.define('users', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [7],
                isEmail: true
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [5]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [5]
            }
        }
    });
    users.associate = function(models) {
        users.hasMany(models.results, {
            //if a user is deleted, delete all of their results
            onDelete: "cascade"
        });
    };
    return users;
};