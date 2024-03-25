var region = ""
var accessKeyId = ""
var secretAccessKey = ""

AWS.config.update({
    region: region,
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
})

var s3 = new AWS.S3()

function refreshFileList(bucketname) {
    var tableBody = document.querySelector("#fileTable tbody");
    tableBody.innerHTML = "";

    s3.listObjectsV2({ Bucket: bucketname }, (err, data) => {
        if (err) {
            console.log("Error fetching file list", err);
        }
        else {
            // console.log(data)
            data.Contents.forEach((object) => {
                var fileRow = document.createElement('tr')
                var fileNameCell = document.createElement('td')
                fileNameCell.textContent = object.Key
                fileRow.appendChild(fileNameCell)

                var fileSizeCell = document.createElement("td");
                fileSizeCell.textContent = object.Size;
                fileRow.appendChild(fileSizeCell);


                var downloadCell = document.createElement('td');
                var downloadLink = document.createElement('a');
                downloadLink.href = s3.getSignedUrl("getObject", {
                    Bucket: bucketname,
                    Key: object.Key,
                });
                downloadLink.textContent = "Download"
                downloadCell.appendChild(downloadLink)
                fileRow.appendChild(downloadCell)

                var deleteCell = document.createElement('td')
                var deleteButton = document.createElement('button')
                deleteButton.textContent = 'Delete'
                deleteButton.addEventListener('click', () => {
                    deleteFile(bucketname, object.Key)
                })
                deleteCell.appendChild(deleteButton)
                fileRow.appendChild(deleteCell)

                tableBody.appendChild(fileRow)
            })
        }
    })
}

function deleteFile(bucketname, key) {
    var params = {
        Bucket: bucketname,
        Key: key
    }

    var xhr = new XMLHttpRequest();
        xhr.open('POST', '/delete', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                alert('File details sent successfully!');
            } else {
                alert('Error sending file details!');
            }
        };
        xhr.send(JSON.stringify({ name: params.Key }));
    
    s3.deleteObject(params, (err, data) => {
        alert("File deleted Successfully!")
        refreshFileList(bucketname)
    })
}

function uploadFiles(bucketname) {
    let files = document.getElementById('fileInput').files

    var fileCount = files.length

    for (var i = 0; i < fileCount; i++) {
        var file = files[i];
        var params = {
            Bucket: bucketname,
            Key: file.name,
            Body: file
        }

        s3.upload(params, (err, data) => {
            alert("File Uploaded successfully!")
            refreshFileList(bucketname)
        })

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                alert('File details sent successfully!');
            } else {
                alert('Error sending file details!');
            }
        };
        xhr.send(JSON.stringify({ name: file.name, bucketName: bucketname, size:file.size }));
    }


}

function goToHome() {
    window.location.href = "/"; // Redirect to the home page
}

refreshFileList("cloudsecbucket");