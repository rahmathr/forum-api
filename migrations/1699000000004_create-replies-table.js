/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    content: { type: 'TEXT', notNull: true },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"comments"',
      onDelete: 'CASCADE',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    date: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
    is_delete: { type: 'BOOLEAN', notNull: true, default: false },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
