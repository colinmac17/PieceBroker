//User Model
module.exports = function(sequelize, DataTypes) {
    var user_info = sequelize.define('user_info', {
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
    user_info.associate = function(models) {
        user_info.hasMany(models.results, {
            //if a user is deleted, delete all of their results
            onDelete: "cascade"
        });
    };
    return user_info;
};