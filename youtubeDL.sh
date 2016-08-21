echo "Executing Upload..."

# Creating directory for storing saved media
mkdir $2
cd $2

# Downloading youtube videos
youtube-dl --no-warnings --write-thumbnail --ignore-errors --no-overwrites $1 | grep download

# Removing filename spaces
find -name "* *" -type f | rename 's/ /_/g'


for i in *.webm;
do name=$(basename "$i" .webm);
	echo "Converting $name to mp3...";
	ffmpeg -v 0 -i $i $name.mp3;
	echo -n "done"
	mv $name.mp3 pre$name.mp3
	echo "applying album artwork..."
	ffmpeg -v 0 -y -f mp3 -i pre$name.mp3 -i $name.jpg -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (Front)" $name.mp3
	rm pre$name.mp3
	echo -n "done";
done

for i in *.mkv;
do name=$(basename "$i" .mkv);
	echo "Converting $name to mp3...";
	ffmpeg -v 0 -i $i $name.mp3;
	echo -n "done";
	mv $name.mp3 pre$name.mp3
	echo "applying album artwork..."
	ffmpeg -v 0 -y -f mp3 -i pre$name.mp3 -i $name.jpg -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (Front)" $name.mp3
	rm pre$name.mp3
	echo -n "done"; 
done

for i in *.mp4; 
do name=$(basename "$i" .mp4);
	echo "Converting $name to mp3...";
	ffmpeg -v 0 -i $i $name.mp3;
	echo -n "done";
	mv $name.mp3 pre$name.mp3
	echo "applying album artwork..."
	ffmpeg -v 0 -y -f mp3 -i pre$name.mp3 -i $name.jpg -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (Front)" $name.mp3
	rm pre$name.mp3
	echo -n "done"; 
done

# Removing video and image files
echo "Cleaning up..."
rm *.mp4 *.mkv *.webm *.jpg *.part