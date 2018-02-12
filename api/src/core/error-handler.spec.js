import chai from 'chai';
import sinon from 'sinon';
import mockery from 'mockery';
import sinonChai from 'sinon-chai';

import * as module from './error-handler';

describe('Error Handler', function() {
    const expect = chai.expect;

    let reqStub;
    let resStub;
    let errStub;
    let nextStub;

    chai.use(sinonChai);

    before(function() {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });
    });

    beforeEach(function() {
        reqStub = {};
        resStub = {
            status: sinon.stub().returns({ send: sinon.spy() })
        };
        errStub = {
            stack: 'hello'
        };
        nextStub = sinon.stub();

        mockery.registerAllowable('./error-handler', true);
    });

    afterEach(function() {
        mockery.deregisterAllowable('./error-handler');
        mockery.deregisterAll();
        mockery.resetCache();
    });

    after(function() {
        mockery.disable();
    });

    it('should exist', function() {
        expect(module).to.exist;
    });

    describe('logErrors()', function() {
        it('should correctly handle an error', function() {
            module.logErrors(errStub, reqStub, resStub, nextStub);
            expect(nextStub).to.be.calledWith(errStub);
        });
    });

    describe('errorHandler()', function() {
        it('should send 500 response', function() {
            module.errorHandler(errStub, reqStub, resStub, nextStub);
            expect(resStub.status).to.be.calledWith(500);
        });
    });
});