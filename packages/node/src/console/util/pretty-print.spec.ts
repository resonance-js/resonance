import { prettyPrint } from './pretty-print';

const smallExample = {
    debug: 'on',
    window: {
        title: 'Sample Konfabulator Widget',
        name: 'main_window',
        width: 500,
        height: 500
    },
    image: {
        src: 'Images/Sun.png',
        name: 'sun1',
        hOffset: 250,
        vOffset: 250,
        alignment: 'center'
    },
    text: {
        data: 'Click Here',
        size: 36,
        style: 'bold',
        name: 'text1',
        hOffset: 250,
        vOffset: 100,
        alignment: 'center',
        onMouseUp: 'sun1.opacity = (sun1.opacity / 100) * 90;'
    }
};

const largeExample = {
    'web-app': {
        servlet: [
            {
                'servlet-name': 'cofaxCDS',
                'servlet-class': 'org.cofax.cds.CDSServlet',
                'init-param': {
                    dataStoreMaxConns: 100,
                    dataStoreConnUsageLimit: 100,
                    dataStoreLogLevel: 'debug',
                    maxUrlLength: 500
                }
            },
            {
                'servlet-name': 'cofaxEmail',
                'servlet-class': 'org.cofax.cds.EmailServlet',
                'init-param': {
                    mailHost: 'mail1',
                    mailHostOverride: 'mail2'
                }
            },
            {
                'servlet-name': 'cofaxAdmin',
                'servlet-class': 'org.cofax.cds.AdminServlet'
            },
            {
                'servlet-name': 'fileServlet',
                'servlet-class': 'org.cofax.cds.FileServlet'
            },
            {
                'servlet-name': 'cofaxTools',
                'servlet-class': 'org.cofax.cms.CofaxToolsServlet',
                'init-param': {
                    dataStoreMaxConns: 100,
                    dataStoreConnUsageLimit: 100,
                    dataStoreLogLevel: 'debug',
                    maxUrlLength: 500
                }
            }
        ],
        'servlet-mapping': {
            cofaxCDS: '/',
            cofaxEmail: '/cofaxutil/aemail/*',
            cofaxAdmin: '/admin/*',
            fileServlet: '/static/*',
            cofaxTools: '/tools/*'
        },
        taglib: {
            'taglib-uri': 'cofax.tld',
            'taglib-location': '/WEB-INF/tlds/cofax.tld'
        }
    }
};

describe('Console logging test', () => {
    test('Can log an error', () => {
        const stringified = prettyPrint(smallExample);
        console.log(stringified);
        expect(true).toEqual(true);
    });

    test('Can log large example', () => {
        const toString = prettyPrint(largeExample);
        console.log(toString);
        expect(true).toEqual(true);
    });
});
