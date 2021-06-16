define([
    'app/constant',
    'shared/data', 
    'shared/functions', 
    'features/modal/modalProfile'
], (
    constant,
    GLOBAL,
    functions, 
    modalProfileComp
) => {
    const { render, getAvatar, htmlEncode } = functions;
    const template = `
        <a title="Edit Profile" class="sipr-image">
            <img ${constant.ATTRIBUTE_CHANGE_IMAGE}="{id}" class="--avatar avatar p-cur" src="{src}" onerror="this.src='/assets/images/user.jpg'">
        </a>
        <p ${constant.ATTRIBUTE_CHANGE_NAME}="{id}" class="--name">{name}</p>
    `;
    const templateLeftBar = `
        <img src="{src}" ${constant.ATTRIBUTE_CHANGE_IMAGE}="{id}" class="avatar" onerror="this.src='/assets/images/user.jpg'" alt="" />
    `;

    return {
        onInit: () => {
            const info = GLOBAL.getInfomation();
            const data = {
                src: getAvatar(info.id),
                name: htmlEncode(info.name),
                id: info.id
            };

            $('#sidebarProfile').html(render(template, data));
            $('#leftbar .lb-cuser-avatar').html(render(templateLeftBar, data));
            $('#sidebarProfile .sipr-image').off().click(modalProfileComp.onInit);
            $('#leftbar .lb-cuser-avatar').off().click(modalProfileComp.onInit);
        }
    };
});
