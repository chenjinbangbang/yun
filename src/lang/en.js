export default {
    title: 'CMB Cloud Storage',
    route: {
        home: 'Home',
        chart: 'Chart',

        status: 'State Monitoring',
        metadata: 'Region Monitoring',
        gateway: 'Storage Agency Monitoring',
        monitor: 'Oneself Monitoring',
        metalist:'Monitoring List',
        treemap:'Monitoring Structure',

        regionHome: 'Regional Center',
        region: 'Regional Center',
        client: 'Client',
        storageagency: 'Storage Agent',

        systemHome: 'System Management',
        users: 'User Management',
        smtp: 'System Settings',
        logs: 'Operation Log',

        user: 'User Setting',
        minchart: 'Minchart',
        changepwd: 'Password Change',

        dndList: 'Dnd List',
        splitPane: 'SplitPane',
        avatarUpload: 'Avatar Upload',
        dropzone: 'Dropzone',
        sticky: 'Sticky',
        countTo: 'CountTo',
        componentMixin: 'Mixin',
        backToTop: 'BackToTop',
        charts: 'Charts',
        keyboardChart: 'Keyboard Chart',
        lineChart: 'Line Chart',
        mixChart: 'Mix Chart',
        example: 'Example',
        Table: 'Table',
        dynamicTable: 'Dynamic Table',
        dragTable: 'Drag Table',
        inlineEditTable: 'Inline Edit',
        complexTable: 'Complex Table',
        tab: 'Tab',
        form: 'Form',
        createForm: 'Create Form',
        editForm: 'Edit Form',
        errorPages: 'Error Pages',
        page401: '401',
        page404: '404',
        errorLog: 'Error Log',
        excel: 'Excel',
        exportExcel: 'Export Excel',
        selectExcel: 'Export Selected',
        uploadExcel: 'Upload Excel',
        exportZip: 'Zip',
        theme: 'Theme',
        clipboardDemo: 'Clipboard',
        i18n: 'I18n'
    },
    navbar: {
        logOut: 'Log Out',
        logOutNote: 'Do you want to log out the system?',
        logOutSuccess: 'Log out successfully！',
        changePassword: 'change password',
        dashboard: 'Dashboard',
        github: 'Github',
        screenfull: 'Screenfull',
        language: 'Language',
        theme: 'theme'
    },
    //登录
    login: {
        title: 'Login Form',
        logIn: 'Log in',
        username: 'Username',
        password: 'Password',
        forgetPwd: 'Forget password',
        any: 'any',
        keepLogin: 'Keep login',
        thirdparty: 'Or connect with',
        thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation! ! !'
    },
    //找回密码
    findbackpwd: {
        step1: 'Fillout E-mail',
        step2: 'Verify E-mail and set a new password',
        step3: 'Complete',
        emailNote: 'Please enter your username E-mail',
        code: 'Verification code',
        pass: 'Enter new password',
        checkPass: 'Confirm new password',
        codeNote: 'Please enter verification code you received.',
        updateSuccess: 'Congratulations on Your success!',
        tip: 'After 3 seconds later jump...',
        clickJump: 'Click jump'
    },
    //区域管理
    region: {
        search: 'Search region,the format is separated by Spaces.',
        createRegion: 'Create Region',
        updateRegion: 'Update Region',
        use: 'Use',
        nonuse: 'Nonuse',
        maintain: 'Maintain',

        idMsg: 'The region id cannot be empty,and only digit',
        regionNameMsg: 'The regionName cannot be empty',
        locationMsg: 'The location cannot be empty',
        dbIpMsg: 'The region db ip cannot be empty',
        dbPortMsg: 'The region db port cannot be empty',
        msIpMsg: 'The region server ip cannot be empty',
        msPortMsg: 'The region server ip cannot be empty',
        ipRule: 'Wrong input the ip address format',
        portRule: 'Wrong input the port format',

        id: 'Region ID',
        region_id: 'Region ID',
        regionName: 'Region',
        location: 'Region address',
        dbIp: 'Region DB ip',
        dbPort: 'Region DB Port',
        msIp: 'Region Server ip',
        msPort: 'Region Server port',
        clientNum: 'Client Num',
        storageAgencyNum: 'Storage Agency Num',
        status: 'Status',
        actions: 'Actions'
    },
    //客户端管理
    client: {
        search: 'Search client name,the format is separated by Spaces.',
        street: 'Detailed address',
        createBatch: 'Batch create',
        updateBatch: 'Batch update client configs',
        viewConfig: 'View configuration records',
        createClient: 'Create Client',
        updateClient: 'Update Client',
        createBatchSuccess: 'Batch create success',
        updateBatchSuccess: 'Batch update success',
        uploadText: 'Drag the file here,or <em>click to the upload</em>',
        uploadTip: 'Can Only upload the excel files,and no more than 500kb',
        uploadTip1: 'Can Only upload the excel files',
        uploadTip2: 'No more than 500kb',
        chooseRegion: 'Choose region',

        site_idMsg: 'The site id cannot be empty',
        clientNameMsg: 'The client name cannot be empty',
        locationMsg: 'The client address cannot be empty',
        log_server_ipMsg: 'The log server ip cannot be empty',
        log_server_portMsg: 'The log server port cannot be empty',
        fileMsg: 'Please upload the excel file' ,

        streetMsg: 'Special characters cannot be entered in a detailed address',

        id: 'ID',
        site_id: 'Site ID',
        regionName: 'Region',
        clientName: 'Client',
        location: 'Location',
        addTime: 'Add TIme',
        newConfigTime: 'Latest configuration time',
        status: 'Status',
        actions: 'Actions',
    },
    //存储代理列表
    agency: {
        search: 'Search agency ip,the format is separated by Spaces.',

        id: 'ID',
        regionName: 'Region',
        storageAgencyIp: 'Storage agency ip',
        connectClientNum: 'Connect client num',
        businessNum: 'Business num',
        capacityUsed: 'Capacity used',
        capacityUsable: 'Capacity usable',
        capacityTotal: 'Capacity total',
        status: 'Status',
        actions: 'Actions',
    },
    //邮件服务器设置
    smtp: {
        smtp_ipMsg: 'The Smtp server ip address cannot be empty',
        portMsg: 'The Smtp server port cannot be empty',
        is_encryptMsg: 'The encrypt option cannot be empty',
        is_verifyMsg: 'The verify option cannot be empty',

        smtp_ip: 'Smtp server',
        smtp_port: 'Smtp port',
        username: 'Smtp username',
        password: 'Smtp password',
        is_verify: 'Do you need validation?',
        need: 'Need',
        noneed: 'No need',
        is_encrypt: 'Do you encrypt?',
        no: 'No encrypt',
        yes: 'Encrypt',
        note: 'Sends thie necessary information when retrieving thie password,and sends mail when the system notifies.',
    },
    //操作日志
    logs: {
        search: 'Search username,the format is separated by Spaces.',
        toTime: 'To',
        startTime: 'Start Date',
        endTime: 'End Date',

        id: 'ID',
        username: 'Username',
        content: 'Content',
        time: 'Time',
    },
    //用户管理
    user: {
        search: 'Search username,the format is separated by Spaces.',
        createUser: 'Create User',
        updateUser: 'Update User',
        enterIntro: 'Please enter content...',
        admin: 'Admin',
        user: 'User',
        superAdmin: 'Super Admin',
        detail: 'Detail',
        userNote: 'The username cannot be admin.',

        usernameMsg: 'The username cannot be empty',
        passwordMsg: 'The password cannot be empty',
        emailMsg: 'The E-mail cannot be empty',
        phoneMsg: 'The phone number cannot be empty',
        usernameRule: 'The username must consist of 1-18 bits of Chinese/alphabet/number /@/./_/-',
        passwordRule: 'The password must be composed of 6-18 bits of Chinese/alphabet/number /@/./_/-',
        emailRule: 'Wrong input E-mail format',
        phoneRule: 'Wrong input phone number format',

        id: 'ID',
        username: 'Username',
        password: 'Password',
        email: 'Email',
        phone: 'Phone',
        roles: 'Roles',
        introduction: 'Intro',
        actions: 'Actions',
    },
    //密码修改
    changepwd: {
        newPwdMsg: 'Please enter the new password',
        newPwdRepMsg: 'Please repeat the new password',
        passwordMsg: 'Please enter the old password',
        newPwdRepRule: 'The two input passwords do not match',
        passwordRule: 'Cannot be the same as the new password',

        newPwd: 'New password',
        newPwdRep: 'Repeat new password',
        password: 'Old password',
    },
    documentation: {
        documentation: 'Documentation',
        github: 'Github Repository'
    },
    permission: {
        roles: 'Your roles',
        switchRoles: 'Switch roles'
    },
    components: {
        documentation: 'Documentation',
        tinymceTips: 'Rich text editor is a core part of management system, but at the same time is a place with lots of problems. In the process of selecting rich texts, I also walked a lot of detours. The common rich text editors in the market are basically used, and the finally chose Tinymce. See documentation for more detailed rich text editor comparisons and introductions.',
        dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.',
        stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
        backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
        backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
        imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
    },
    table: {
        search: 'Search',
        save: 'Save',
        cancel: 'Cancel',
        success: 'Success',
        createSuccess: 'Create success',
        updateSuccess: 'Update success',
        deleteNote: 'Do you delete this data?',
        note: 'Note',
        delete: 'Delete',
        deleteSuccess: 'Delete success',
        resetNote: 'Do you reset this user\'s password?',
        reset: 'Reset',
        resetSuccess: 'Reset password successfully, password reset to: 000000',
        updatePwdSuccess: 'Update password successfully',
        submit: 'Submit',

        dynamicTips1: 'Fixed header, sorted by header order',
        dynamicTips2: 'Not fixed header, sorted by click order',
        dragTips1: 'The default order',
        dragTips2: 'The after dragging order',
        title: 'Title',
        importance: 'Imp',
        type: 'Type',
        remark: 'Remark',
        add: 'Add',
        export: 'Export',
        reviewer: 'reviewer',
        id: 'ID',
        date: 'Date',
        author: 'Author',
        readings: 'Readings',
        status: 'Status',
        actions: 'Actions',
        edit: 'Edit',
        resetPwd: 'Reset Pwd',
        publish: 'Publish',
        draft: 'Draft',
        delete: 'Delete',
        confirm: 'Confirm',
        subserver: 'Subserver'
    },
    errorLog: {
        tips: 'Please click the bug icon in the upper right corner',
        description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
        documentation: 'Document introduction'
    },
    excel: {
        export: 'Export',
        selectedExport: 'Export selected items',
        placeholder: 'Please enter the file name(default excel-list)'
    },
    zip: {
        export: 'Export',
        placeholder: 'Please enter the file name(default file)'
    },
    theme: {
        change: 'Theme change',
        documentation: 'Theme documentation',
        tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
    },
    //错误码
    error_message: {
        1: 'Request failed',
        2: 'Not login',
        3: 'Invalid token',
        4: 'There is no Email address',
        5: 'Failed to Send Email',
        6: 'Invalid verification code',
        7: 'Login failure',
        400: 'Request Error',
        401: 'Insufficient authority',
        404: 'The requested content was not found',
        500:'Server error',
        1001: 'Repetitive SiteId'
    }
}
