<!-- src/Resources/views/Security/login.html.php -->
<?php $title = 'DBEC Dashboard' ?>

<?php ob_start() ?>
    <?php if ($user): ?>
    <h1>Hi <?php echo $user->getUsername() ?></h1> <a href="/logout">Logout</a>
    <?php endif ?>

    <h1>Dashboard</h1>
    
    <h3>Connections</h3>
    <p>
        <a href="connections">List</a>
        <a href="connections/add">Add new</a>
    </p>
    
    <h3>Entities</h3>
    <p>
        <a href="entities">List</a>
        <a href="entities/add">Add new</a>
    </p>
    
<?php $content = ob_get_clean() ?>

<?php include '../templates/layout.php' ?>
