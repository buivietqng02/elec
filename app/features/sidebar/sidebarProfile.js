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
    const $wrapper = $('#sidebarProfile');
    const template = `
        <a title="Edit Profile" class="sipr-image">
            <img ${constant.ATTRIBUTE_CHANGE_IMAGE}="{id}" class="--avatar avatar p-cur" src="{src}" onerror="this.src='/assets/images/user.jpg'">
        </a>
        <p ${constant.ATTRIBUTE_CHANGE_NAME}="{id}" class="--name">{name}</p>
    `;

    return {
        onInit: () => {
            const info = GLOBAL.getInfomation();
            const data = {
                src: getAvatar(info.id),
                name: htmlEncode(info.name),
                id: info.id
            };

            $wrapper.html(render(template, data));
            $(document).on('click', '#sidebarProfile .sipr-image', modalProfileComp.onInit);
        }
    };
});
