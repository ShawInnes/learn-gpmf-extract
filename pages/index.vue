<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
<div>
    <div v-if="chosenFile">
      <div>
        <v-progress-linear
          v-model="progress"
          color="light-blue"
          height="25"
          reactive
        >
          <strong>{{ progress }} %</strong>
        </v-progress-linear>
      </div>
    </div>

    <v-row no-gutters justify="center" align="center">
      <v-col cols="8">
        <v-file-input
          v-model="chosenFile"
          show-size
          label="File input"
        ></v-file-input>
      </v-col>

      <v-col cols="4" class="pl-2">
        <v-btn color="success" dark small @click="process">
          Upload
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="deviceName" border="left" color="blue-grey" dark>
      {{ deviceName }}
    </v-alert>

    <v-alert v-if="message" border="left" color="blue-grey" dark>
      {{ message }}
    </v-alert>

    <v-card v-if="fileInfos.length > 0" class="mx-auto">
      <v-list>
        <v-subheader>List of Streams</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item v-for="(file, index) in fileInfos" :key="index">
            {{file.key}}: {{file.name}} ({{file.samples}} Samples)
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
    </v-col>
  </v-row>
</template>

<script>
import ProcessService from "../services/ProcessFileService";

export default {
  name: "ProcessFile",
  data() {
    return {
      chosenFile: null,
      progress: 0,
      message: "",
      deviceName: "",

      fileInfos: []
    };
  },
  methods: {
    selectFile(file) {
      this.progress = 0;
      this.chosenFile = file;
    },
    process() {
      if (!this.chosenFile) {
        this.message = "Please select a file!";
        return;
      }
      
      ProcessService.process(this.chosenFile, (event) => {
        this.progress = Math.round((100.0 * event) / 100.0);
      }).then((event) => {
        this.progress = 100.0;
        const data = event.data[1];

        this.deviceName = data['device name'];
        this.message = `Video Duration: ${event.result.timing.videoDuration}`;
        console.log(data.streams);
        Object.keys(data.streams).forEach((streamKey) => this.fileInfos.push({
          key: streamKey,
          name: data.streams[streamKey].name,
          samples: data.streams[streamKey].samples.length
        }));
      });
    },
  }
};
</script>