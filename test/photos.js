process.env.NODE_ENV = 'test';

const _ = require('lodash');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../index');

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const Search = require('../app/services/search');

chai.use(chaiHttp);

describe('Photos', () => {
	describe('GET /api/photos/:reference', () => {
		it('should proxy iamge request to Google', () => {
			const reference = 'CoQBdwAAAOYWD1u7ntMSOqmVVa_dSV8pLbAPRMxJJn2CpwqaJUMGIfdxlBCNHKr_FzrpcbgI1AlS_3vNrjS7c9cehEn_0eQkELzuQlqZP4H_umajRaD__z7xvHLLSVXEeusy1ezzCPTMvULAu92mvnilYc1npeIQNaZtumVs6Ohxxr8Q6ELREhAC8krDckyhO2bwG4ujQ4pRGhQamdigQ98hUF3lQRWImmn5nGEi0A';

			return chai.request(server)
				.get(`/api/photos/${reference}`)
				.then(res => {
					expect(res).to.have.status(200);
					expect(res.headers).to.be.an('object');
					expect(res.headers['content-type']).to.be.equal('image/jpeg');
				});
		})
	});
});
