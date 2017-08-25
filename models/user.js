//User Model
module.exports = function(sequelize, DataTypes) {
    var users = sequelize.define('users', {
        fist_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2]
            }
        },
        last_name: {
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
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6]
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