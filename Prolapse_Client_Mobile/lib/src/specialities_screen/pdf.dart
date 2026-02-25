import 'package:flutter/material.dart';
import 'package:pdf_render/pdf_render_widgets.dart';

class PdfScreen extends StatefulWidget {
  final String src;
  final String title;
  const PdfScreen({super.key, required this.title, required this.src});

  @override
  State<PdfScreen> createState() => _PdfState();
}

class _PdfState extends State<PdfScreen> {
  String src = "";
  String title = "";

  @override
  void initState() {
    super.initState();
    src = widget.src;
    title = widget.title;
  }

  @override
  void didUpdateWidget(PdfScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.src != oldWidget.src) {
      setState(() {
        src = widget.src;
        title = widget.title;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: const Color(0xff0147a6),
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios),
            color: Colors.white,
            onPressed: () => Navigator.pop(context),
          ),
          title: Text(
            title,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        body: PdfViewer.openAsset(src));
  }
}
