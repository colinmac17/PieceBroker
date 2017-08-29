//User Model
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('user', {
        first_name: {
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
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });
    User.associate = function(models) {
        User.hasMany(models.result, {
            //if a user is deleted, delete all of their results
            onDelete: "cascade"
        });
    };
    return User;
};