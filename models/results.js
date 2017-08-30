//Results Model
module.exports = function(sequelize, DataTypes) {
    var Result = sequelize.define('result', {
        restaurant_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        cuisine_type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        budget: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        rating: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                len: [1]
            }
        },
        link: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1]
            }
        },
        saved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate: {
                len: [1]
            }
        }
    });

    Result.associate = function(models) {
        // We're saying that a result should belong to a user
        // A result can't be created without a user due to the foreign key constraint
        Result.belongsTo(models.user, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    return Result;
};