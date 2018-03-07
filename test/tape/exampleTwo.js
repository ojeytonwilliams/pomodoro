var test = require('tape');

test('example test', function (t) {
    t.plan(3);

    t.equal("blue", "blu" + "e");
    t.equal(parseInt("2"), 2);
    t.ok(true);
});

test('yet another example test', function (t) {
    t.plan(2);

    t.equal("blue", "blu" + "e");
    t.equal(parseInt("2"), 2);
});
