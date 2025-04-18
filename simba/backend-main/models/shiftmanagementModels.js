const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User  = require('./userModel');

const ShiftType = sequelize.define('shifttype', {
  shifttypeid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  shiftname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  defaultduration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  shiftcategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'shift_types',
  timestamps: false,
});

const Shift = sequelize.define('shift', {
  shiftid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  shifttypeid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: ShiftType,
      key: 'shifttypeid'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  shiftstarttime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  shiftendtime: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfter(value) {
        if (value <= this.shiftstarttime) {
          throw new Error('Shift end time must be after shift start time');
        }
      }
    }
  },
  shiftduration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shiftlocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createddate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updateddate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'shifts',
  timestamps: false,
  hooks: {
    beforeValidate: (shift) => {
      if (shift.shiftstarttime && shift.shiftendtime) {
        shift.shiftduration = Math.round(
          (new Date(shift.shiftendtime) - new Date(shift.shiftstarttime)) / (1000 * 60)
        );
      }

      if (!shift.shiftduration || shift.shiftduration <= 0) {
        throw new Error('Shift duration must be a positive number.');
      }
    },
    beforeUpdate: (shift) => {
      shift.updateddate = new Date();
      if (shift.changed('shiftendtime') || shift.changed('shiftstarttime')) {
        shift.shiftduration = Math.round(
          (new Date(shift.shiftendtime) - new Date(shift.shiftstarttime)) / (1000 * 60)
        );
      }
    }
  }
});

// Define Associations
ShiftType.hasMany(Shift, {
  foreignKey: 'shifttypeid',
  as: 'shifts' // Optional: Alias for the association
});

Shift.belongsTo(ShiftType, {
  foreignKey: 'shifttypeid',
  as: 'shifttype' // Optional: Alias for the association
});

const AssignedShift = sequelize.define('AssignedShift', {
  shiftid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'shifts',
      key: 'shiftid',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  userid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'userid', // Adjust the key if necessary
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  assigned_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'assigned_shifts',
  timestamps: false,
  hooks: {
    beforeCreate: (assignedShift, options) => {
      // Assuming 'currentAdminEmail' is accessible in your context
      assignedShift.assigned_by = options.email; // Set the email of the admin assigning the shift
      assignedShift.assigned_at = new Date();
    },
  },
});

// Define associations
AssignedShift.belongsTo(Shift, { foreignKey: 'shiftid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
AssignedShift.belongsTo(User, { foreignKey: 'userid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });


module.exports = { ShiftType, Shift, AssignedShift };
