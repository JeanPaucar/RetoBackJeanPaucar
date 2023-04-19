export default {
  type: "object",
  properties: {
    game: {
      type: "array",
      items:{
        type: 'object',
        properties: {
          players: { type: 'number' },
          plays:{
            type: 'string',
            pattern: '^[lcrLCR.]+$'
          },
        }        
      }
    },
    
  }
} as const;
