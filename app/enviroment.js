define(() => {
    // const XM_URL = 'xm.iptp.net';
    const XM_URL = process.env.NODE_ENV === 'production' ? '' : 'https://xm.iptp.dev/';
    const BASE_URL = `${XM_URL}xm`;

    return BASE_URL;
});
