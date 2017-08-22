//Results Model
module.exports = function(sequelize, DataTypes) {
    var results = sequelize.define('results', {
        restaurant_name: {
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
        type: {
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
        }
    });

    results.associate = function(models) {
        // We're saying that a result should belong to a user
        // A result can't be created without a user due to the foreign key constraint
        results.belongsTo(models.users, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    return results;
};