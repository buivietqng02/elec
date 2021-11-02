define([
    'app/constant',
    'shared/api',
    'shared/data'
], (
    constant,
    API,
    GLOBAL
) => {
    let conferenceBtn;
    let iframeConferenceWraper;
    let iframeConf;
    let conferenceHeader;
    let isConfering = false;

    const initConference = (link) => {
        console.log(link);
        if (link === '') {
            API.get('conference').then((res) => {
                console.log(res);
                const id = (+new Date()).toString(16).toUpperCase();
                const url = `${constant.ROUTE.meeting}/${id}?jwt=${res}`;
                iframeConf.src = url;
            }).catch((err) => {
                console.log(err);
            });
        } else {
            iframeConf.src = link;
        }
    };

    const initConferencePage = (link) => {
        conferenceBtn.innerHTML = `<lang data-language="STOP_CONFERENCE">${GLOBAL.getLangJson().STOP_CONFERENCE}</lang>`;
        conferenceBtn.style.backgroundColor = '#FF5C58';
        iframeConf = document.createElement('iframe');
        iframeConferenceWraper.appendChild(iframeConf);
        conferenceHeader.style.display = 'none';

        initConference(link);

        isConfering = true;
    };

    const toggleMeetingPage = (link) => {
        conferenceBtn.addEventListener('click', () => {
            if (isConfering) {
                conferenceBtn.innerHTML = `<lang data-language="START_CONFERENCE">${GLOBAL.getLangJson().START_CONFERENCE}</lang>`;
                conferenceBtn.style.backgroundColor = '#193498';
                iframeConferenceWraper.removeChild(iframeConf);
                conferenceHeader.style.display = 'block';
                isConfering = false;
            } else {
                initConferencePage(link);
            }
        });
    };

    return {
        onInit: () => {
            conferenceBtn = document.querySelector('#conference-content__startBtn');

            iframeConferenceWraper = document.querySelector('.conference-content-iframe');

            conferenceHeader = document.querySelector('.conference-content__header');

            toggleMeetingPage();
        },

        onInitConferencePage: (link) => initConferencePage(link)
    };
});
