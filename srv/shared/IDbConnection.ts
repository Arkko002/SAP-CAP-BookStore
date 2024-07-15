import * as hana from '@sap/hana-client';

const connOptions: hana.ConnectionOptions = {
    serverNode: 'host:port',
    UID: process.env.hanaUsername,
    PWD: process.env.hanaPassword,
    traceFile: 'stdout',
    traceOptions: 'sql=warning',
    encrypt: 'true',  //Must be set to true when connecting to HANA as a Service
    // sslValidateCertificate: 'false',  //Must be set to false when connecting to an SAP HANA, express edition instance that uses a self-signed certificate.
};

const poolOptions = {
    poolCapacity: 10,  //max # of connections in the pool waiting to be used
    maxConnectedOrPooled: 20, //max # of connections in the pool + the # of connections in use
    pingCheck: false,
    allowSwitchUser: true,  //requires SAP HANA client 2.17
    maxPooledIdleTime: 3600, //1 hour (in seconds)

}

class HanaConnection implements IDbConnection {
    private readonly _conn: hana.Connection;
    private readonly _pool: hana.ConnectionPool | undefined;

    public constructor(connOptions: hana.ConnectionOptions, poolOptions?: hana.PoolOptions) {
	if (poolOptions) {
	    this._pool = hana.createPool(connOptions, poolOptions)
	}

	this._conn = hana.createConnection(connOptions);
    }

    public exec(query: string): void {
	const conn = this._pool ? this._pool.getConnection() : this._conn;

	const statement: hana.Statement = conn.prepare(query);
	const result: hana.ResultSet = statement.execQuery()
	while (result.next()) {
	    const row: {[key: string]: string} = result.getValues();
	    console.log(row);
	}
    }
}

export interface IDbConnection {
    // TODO: return value
    exec(query: string):void;
}

const hanaConnection: HanaConnection = new HanaConnection(connOptions, poolOptions);

export default hanaConnection;
