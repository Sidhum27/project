module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define("Employee", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    autoIncrement: true
    },
    date: {
      type: Sequelize.DATE
    },
    open: {
      type: Sequelize.FLOAT
    },
    high: {
      type: Sequelize.FLOAT
    },
    low: {
      type: Sequelize.FLOAT
    },
    close: {
      type: Sequelize.FLOAT
    }
    
     },{tableName: 'Employee',timestamps: false,});

  return Employee;
};
