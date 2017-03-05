// add the initial admin user.

const keystone = require('keystone');
const User = keystone.list('User');

module.exports = done => {
    new User.model({
        name: { first: 'Admin' },
        email: 'lawrence.smith.3@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'admin',
        canAccessKeystone: true,
    })
    .save(done);
    new User.model({
        name: { first: 'Joe', last: 'Public' },
        email: 'joe.public@example.com',
        password: process.env.PUBLIC_PASSWORD || 'splitseven',
        canAccessKeystone: true,
    })
    .save(done);
};
