var lodash   = require("lodash"),
    utils    = require("../../utils"),
    consts   = require("../../utils/consts"),
    dbConfig = require("../../config/database"),
    config   = require("../helpers/config"), 
    users    = require("../helpers/users"),
    db, services;


dbConfig.set(config && config.db);

db       = require("../../models");
services = require("../../services");


describe("User", function () {

    it("connect with db", function (done) {
        db.sequelize.sync({force: true}).complete(function (err) {
            if (err) return done(err);
            return done();
        });
    });


    /* Create */

    describe("Create", function () {
        it("correct user", function (done) {
            var user = users.user;

            services.users.createUser(user, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(200);

                expect(lodash.keys(data).length).toEqual(1);
                expect(data.username).toEqual(user.username);

                return done();
            });
        });

        it("dup username", function (done) {
            var user = users.user;

            services.users.createUser(user, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(409);

                expect(typeof data).toEqual("string");
                expect(data).toEqual("username");

                return done();
            });
        });

        it("dup email", function (done) {
            var user = users.user;
            user.username="other";
            
            services.users.createUser(user, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(409);

                expect(typeof data).toEqual("string");
                expect(data).toEqual("email");

                return done();
            });
        });

        it("without fields", function (done) {
            var user = {};

            services.users.createUser(user, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(400);

                expect(data.username[0]).toEqual(consts.VALIDATES.USER.USERNAME.IS);
                expect(data.username[1]).toEqual(consts.VALIDATES.USER.USERNAME.LEN);
                expect(data.password[0]).toEqual(consts.VALIDATES.USER.PASSWORD.NOT_EMPTY);
                expect(data.email[0]).toEqual(consts.VALIDATES.USER.EMAIL.NOT_EMPTY);
                expect(data.email[1]).toEqual(consts.VALIDATES.USER.EMAIL.IS_EMAIL);                

                return done();
            });
        });

        it("bad request", function (done) {
            var user = undefined;

            services.users.createUser(user, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(400);

                expect(data).toEqual(consts.ERROR.BAD_REQUEST);

                return done();
            });
        });
    });

    /* Update */

    describe("Update", function () {
        
        it("correct user", function (done) {
            var user = users.updatedUser;

            services.users.updateUser(1, user, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(200);

                expect(lodash.keys(data).length).toEqual(1);
                expect(data.username).toEqual(user.username);
                console.log(data);

                return done();
            });
        });

        /*it("not found team", function (done) {
            var team = teams.correctTeam;

            services.teams.updateTeam("aaa", team, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(404);

                expect(data).toEqual(consts.ERROR.NOT_FOUND);

                return done();
            });
        });

        it("without fields", function (done) {
            var team = {};

            services.teams.updateTeam(teams.correctTeam.id, team, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(400);

                expect(data.name[0]).toEqual(consts.VALIDATES.TEAM.NAME.LEN);
                expect(data.abbrname[0]).toEqual(consts.VALIDATES.TEAM.ABBRNAME.LEN);
                expect(data.tablename[0]).toEqual(consts.VALIDATES.TEAM.TABLENAME.LEN);
                expect(data.foundation[0]).toEqual(consts.VALIDATES.TEAM.FOUNDATION.IS_DATE);
                expect(data.origin[0]).toEqual(consts.VALIDATES.TEAM.ORIGIN.LEN);
                expect(data.stadium[0]).toEqual(consts.VALIDATES.TEAM.STADIUM.LEN);
                expect(data.capacity[0]).toEqual(consts.VALIDATES.TEAM.CAPACITY.IS_NUMERIC);
                expect(data.president[0]).toEqual(consts.VALIDATES.TEAM.PRESIDENT.LEN);
                expect(data.manager[0]).toEqual(consts.VALIDATES.TEAM.MANAGER.LEN);

                return done();
            });
        });

        it("bad request", function (done) {
            var team = undefined;

            services.teams.updateTeam("aaa", team, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(400);

                expect(data).toEqual(consts.ERROR.BAD_REQUEST);

                return done();
            });
        });*/
    });


    /* Querying teams */

    /*describe("Query", function () {
        it("list of teams", function (done) {
            services.teams.getAllTeams(function (code, data) {
                var team = teams.updatedTeam;

                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(200);

                if("[object Array]" !== Object.prototype.toString.call(data)) {
                    return done("Data is not array");
                }

                expect(data.length).toEqual(1);
                expect(data[0].id).toEqual(team.id);
                expect(data[0].name).toEqual(team.name);
                expect(data[0].abbrname).toEqual(team.abbrname);
                expect(data[0].tablename).toEqual(team.tablename);

                return done();
            });
        });

        it("get team", function (done) {
            var team = teams.updatedTeam;

            services.teams.getTeam(team.id, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(200);

                expect(data.id).toEqual(team.id);
                expect(data.name).toEqual(team.name);
                expect(data.abbrname).toEqual(team.abbrname);
                expect(data.tablename).toEqual(team.tablename);
                expect(new Date(data.foundation)).toEqual(new Date(team.foundation));
                expect(data.origin).toEqual(team.origin);
                expect(data.stadium).toEqual(team.stadium);
                expect(typeof parseInt(data.capacity)).toEqual("number");
                expect(parseInt(data.capacity)).toEqual(parseInt(team.capacity));
                expect(data.president).toEqual(team.president);
                expect(data.manager).toEqual(team.manager);

                return done();
            });
        });

        it("get inexistent team", function (done) {
            services.teams.getTeam("aaa", function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(404);

                expect(data).toEqual(consts.ERROR.NOT_FOUND);

                return done();
            });
        });

    });*/


    /* Delete */

    /*describe("Delete", function () {
        it("correct team", function (done) {
            var team = teams.updatedTeam;

            services.teams.deleteTeam(team.id, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(200);

                expect(data).toEqual(team.id);

                return done();
            });
        });

        it("not found team", function (done) {
            var team = teams.updatedTeam;

            services.teams.deleteTeam(team.id, function (code, data) {
                if(!code || !data) {
                    expect(code).toBeDefined();
                    expect(data).toBeDefined();
                    return done();
                }

                expect(typeof code).toEqual("number");
                expect(code).toEqual(404);

                expect(data).toEqual(consts.ERROR.NOT_FOUND);

                return done();
            });
        });
    });*/

});
