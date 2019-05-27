cube(`Flows`, {
  sql: `SELECT * FROM any_service.flows`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [id, createdat, updatedat]
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    description: {
      sql: `description`,
      type: `string`
    },
    
    credit: {
      sql: `credit`,
      type: `string`
    },
    
    debit: {
      sql: `debit`,
      type: `string`
    },
    
    createdat: {
      sql: `createdAt`,
      type: `time`
    },
    
    updatedat: {
      sql: `updatedAt`,
      type: `time`
    }
  }
});
