<?php

return [
    'sign_in' => '登录',
    'go_to_login' => '前往登录',
    'failed' => '找不到与这些凭据匹配的账户。',

    'forgot_password' => [
        'label' => '忘记密码？',
        'label_help' => '输入您的账户邮箱地址以接收密码重置说明。',
        'button' => '找回账户',
    ],

    'reset_password' => [
        'button' => '重置密码并登录',
    ],

    'two_factor' => [
        'label' => '双因素验证码',
        'label_help' => '此账户需要第二层身份验证才能继续。请输入您设备生成的验证码以完成登录。',
        'checkpoint_failed' => '双因素认证令牌无效。',
    ],

    'throttle' => '登录尝试次数过多。请在 :seconds 秒后重试。',
    'password_requirements' => '密码长度必须至少为 8 个字符，且应仅用于本站。',
    '2fa_must_be_enabled' => '管理员要求您的账户必须启用双因素认证才能使用面板。',
];
