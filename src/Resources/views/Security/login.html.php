<!-- src/Resources/views/Security/login.html.php -->
<?php $title = 'DBEC Login' ?>

<?php ob_start() ?>
    <?php if ($error): ?>
        <div><?php echo $error->getMessage() ?></div>
    <?php endif ?>
    
    <form action="<?php echo $view['router']->path('login') ?>" method="post">
        <label for="username">Username:</label>
        <input type="text" id="username" name="_username" value="<?php echo $last_username ?>" />
    
        <label for="password">Password:</label>
        <input type="password" id="password" name="_password" />
    
        <!--
            If you want to control the URL the user
            is redirected to on success (more details below)-->
        <input type="hidden" name="_target_path" value="/dashboard" /> 
    
        <button type="submit">login</button>
    </form>
<?php $content = ob_get_clean() ?>

<?php include '../templates/layout.php' ?>
