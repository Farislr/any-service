cube(`BalanceFlows`, {
  sql: `SELECT * FROM any_service.balance_flows`,
  
  joins: {
    Balances: {
      sql: `${CUBE}.balance_id = ${Balances}.id`,
      relationship: `belongsTo`
    },
    
    Flows: {
      sql: `${CUBE}.flow_id = ${Flows}.id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [id, createdAt, updatedAt]
    },
    
    balanceId: {
      sql: `balance_id`,
      type: `sum`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    createdAt: {
      sql: `created_at`,
      type: `time`
    },
    
    updatedAt: {
      sql: `updated_at`,
      type: `time`
    }
  }
});
